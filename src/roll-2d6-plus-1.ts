import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

async function roll2d6Plus1() {
  // Create a client transport that connects to our server
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/server.js"],
  });

  // Create the MCP client
  const client = new Client({
    name: "dice-roller-client",
    version: "1.0.0",
  });

  try {
    // Connect to the server
    await client.connect(transport);
    
    // Roll 2d6+1
    const result: CallToolResult = await client.callTool({
      name: "roll",
      arguments: {
        num_dice: 2,
        sides: 6,
        modifier: 1
      }
    });
    
    console.log("Rolling 2d6+1:");
    console.log(result.content![0].text);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

roll2d6Plus1().catch(console.error);