#!/usr/bin/env python3
"""
Zero-dependency Vercel Deployment Script for Chakradhar's Portfolio.
Uses Vercel Build Output API v3 with SHA-1 file digests.
"""

import os
import sys
import json
import hashlib
import urllib.request
import urllib.error
import time

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_NAME = "chakradhar-portfolio"

INCLUDE_EXTENSIONS = {
    '.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg',
    '.svg', '.pdf', '.ico', '.txt', '.webp'
}

EXCLUDE_DIRS = {'.git', '.vercel', 'node_modules', '__pycache__'}
EXCLUDE_FILES = {'deploy_vercel.py'}

def deploy(token):
    print("Collecting files for Vercel Build Output API v3...")
    config_data = json.dumps({'version': 3}).encode()
    config_sha = hashlib.sha1(config_data).hexdigest()

    files_to_upload = {
        '.vercel/output/config.json': {
            'data': config_data,
            'sha': config_sha,
            'size': len(config_data)
        }
    }

    for root, dirs, files in os.walk(PROJECT_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            if f in EXCLUDE_FILES or f.startswith('.'):
                continue
            ext = os.path.splitext(f)[1].lower()
            if ext in INCLUDE_EXTENSIONS:
                fp = os.path.join(root, f)
                rel = os.path.relpath(fp, PROJECT_DIR).replace('\\', '/')
                with open(fp, 'rb') as fp_in:
                    data = fp_in.read()
                sha = hashlib.sha1(data).hexdigest()
                files_to_upload['.vercel/output/static/' + rel] = {
                    'data': data,
                    'sha': sha,
                    'size': len(data)
                }

    print(f"Total files: {len(files_to_upload)}")

    print("\nUploading assets to Vercel blob store...")
    manifest = []
    for path, info in files_to_upload.items():
        print(f"  -> {path} ({info['size']:,} bytes)...", end="", flush=True)
        req = urllib.request.Request(
            'https://api.vercel.com/v2/files',
            data=info['data'],
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/octet-stream',
                'x-vercel-digest': info['sha'],
                'Content-Length': str(info['size'])
            },
            method='POST'
        )
        try:
            with urllib.request.urlopen(req) as resp:
                print(" [OK]")
        except urllib.error.HTTPError as e:
            if e.code == 409:
                print(" [EXISTS]")
            else:
                print(f" [{e.code}]")

        manifest.append({'file': path, 'sha': info['sha'], 'size': info['size']})

    print("\nTriggering production deployment...")
    deploy_payload = {
        'name': PROJECT_NAME,
        'target': 'production',
        'files': manifest
    }
    deploy_req = urllib.request.Request(
        'https://api.vercel.com/v13/deployments',
        data=json.dumps(deploy_payload).encode(),
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        },
        method='POST'
    )

    with urllib.request.urlopen(deploy_req) as resp:
        data = json.loads(resp.read().decode())
        dep_id = data.get('id')
        print(f"Deployment ID: {dep_id}")

    print("Waiting for deployment to become READY...")
    for _ in range(20):
        time.sleep(2)
        poll_req = urllib.request.Request(
            f'https://api.vercel.com/v13/deployments/{dep_id}',
            headers={'Authorization': f'Bearer {token}'}
        )
        try:
            with urllib.request.urlopen(poll_req) as p_resp:
                p_data = json.loads(p_resp.read().decode())
                state = p_data.get('readyState')
                if state == 'READY':
                    aliases = p_data.get('alias', [])
                    prod_url = f"https://{aliases[0]}" if aliases else f"https://{p_data.get('url')}"
                    print("\n=======================================================")
                    print(f"  LIVE PRODUCTION URL: {prod_url}")
                    print("=======================================================\n")
                    return prod_url
        except Exception:
            pass

    return None

if __name__ == "__main__":
    token = os.environ.get("VERCEL_TOKEN")
    if len(sys.argv) > 1:
        token = sys.argv[1]

    if not token:
        print("Usage: python3 deploy_vercel.py <VERCEL_TOKEN>")
        sys.exit(1)

    deploy(token)
