#!/usr/bin/env python3
"""
RAG Agent Server

Usage: python main.py [--port PORT] [--host HOST]
"""

import sys
import logging
import argparse
import asyncio
import os
from pathlib import Path

import uvicorn
from google.adk.cli.fast_api import get_fast_api_app


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sys.path.insert(0, str(Path(__file__).parent))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    
    try:
        if sys.platform.startswith('win'):
            asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        else:
            asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())
    except Exception as e:
        logger.warning(f"Could not set event loop policy: {e}")
    
    app = get_fast_api_app(
        agents_dir=str(Path(__file__).parent),
        allow_origins=["*"],
        web=True,
        host=args.host,
        port=args.port,
    )
    
    logger.info(f"Orchestrator Agent server starting at http://{args.host}:{args.port}")
    
    uvicorn.run(
        app, 
        host=args.host, 
        port=args.port,
        log_level="info",
        access_log=True,
        loop="asyncio"
    )


if __name__ == "__main__":
    main()

