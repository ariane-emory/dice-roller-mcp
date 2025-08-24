#!/usr/bin/env python3
"""
Example Python client for the dice-roller-mcp server.
This script demonstrates how to communicate with the MCP server using JSON-RPC over stdin/stdout.
"""

import json
import subprocess
import sys

def send_request(proc, method, params=None, request_id=1):
    """Send a JSON-RPC request to the MCP server."""
    request = {
        "jsonrpc": "2.0",
        "id": request_id,
        "method": method
    }
    if params:
        request["params"] = params
    
    # Send the request
    proc.stdin.write(json.dumps(request) + "\n")
    proc.stdin.flush()
    
    # Read the response
    response = json.loads(proc.stdout.readline())
    return response

def main():
    # Start the MCP server as a subprocess
    proc = subprocess.Popen(
        ["node", "dist/server.js"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )
    
    try:
        # Initialize the connection
        init_request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-05-03",
                "capabilities": {},
                "clientInfo": {
                    "name": "python-example-client",
                    "version": "1.0.0"
                }
            }
        }
        
        proc.stdin.write(json.dumps(init_request) + "\n")
        proc.stdin.flush()
        
        # Read the initialize response
        init_response = json.loads(proc.stdout.readline())
        print("Initialize response:", init_response)
        
        # Send the initialized notification
        initialized_notification = {
            "jsonrpc": "2.0",
            "method": "notifications/initialized"
        }
        proc.stdin.write(json.dumps(initialized_notification) + "\n")
        proc.stdin.flush()
        
        # List available tools
        tools_response = send_request(proc, "tools/list")
        print("Available tools:", tools_response)
        
        # Roll some dice
        roll_response = send_request(proc, "tools/call", {
            "name": "roll",
            "arguments": {
                "num_dice": 2,
                "sides": 6
            }
        })
        print("Roll 2d6 result:", roll_response)
        
        # Roll dice with a modifier
        roll_response2 = send_request(proc, "tools/call", {
            "name": "roll",
            "arguments": {
                "num_dice": 3,
                "sides": 6,
                "modifier": 1
            }
        })
        print("Roll 3d6+1 result:", roll_response2)
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Clean up
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    main()