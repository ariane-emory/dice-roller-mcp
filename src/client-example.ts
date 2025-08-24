import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function runClient() {
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
    
    // List available tools
    const tools = await client.listTools();
    console.log("Available tools:", tools);
    
    // Call the roll tool
    const result1 = await client.callTool({
      name: "roll",
      arguments: {
        num_dice: 2,
        sides: 6
      }
    });
    console.log("Roll result (2d6):", result1);
    
    // Call the roll tool with a modifier
    const result2 = await client.callTool({
      name: "roll",
      arguments: {
        num_dice: 3,
        sides: 6,
        modifier: 1
      }
    });
    console.log("Roll result (3d6+1):", result2);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

runClient().catch(console.error);