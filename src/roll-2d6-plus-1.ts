import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function roll3d6Plus3() {
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
    
    // Roll 3d6+3
    const result: any = await client.callTool({
      name: "roll",
      arguments: {
        num_dice: 3,
        sides: 6,
        modifier: 3
      }
    });
    
    console.log("Rolling 3d6+3:");
    console.log(result.content[0].text);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

roll3d6Plus3().catch(console.error);