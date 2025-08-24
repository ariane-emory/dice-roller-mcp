import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function runTests() {
  // Create a client transport that connects to our server
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/server.js"],
  });

  // Create the MCP client
  const client = new Client({
    name: "dice-roller-test-client",
    version: "1.0.0",
  });

  try {
    // Connect to the server
    await client.connect(transport);
    
    console.log("Running tests for dice-roller-mcp...\n");
    
    // Test 1: List tools
    console.log("Test 1: List tools");
    const tools: any = await client.listTools();
    console.log("Available tools:", tools.tools.map((t: any) => t.name));
    
    if (tools.tools.length === 1 && tools.tools[0].name === "roll") {
      console.log("✅ Test 1 passed: roll tool is available\n");
    } else {
      console.log("❌ Test 1 failed: roll tool not found\n");
    }
    
    // Test 2: Roll 1d6
    console.log("Test 2: Roll 1d6");
    const result1: any = await client.callTool({
      name: "roll",
      arguments: {
        num_dice: 1,
        sides: 6
      }
    });
    console.log("Result:", result1.content[0].text);
    
    // Parse the result to verify it's in the correct format
    const match1 = result1.content[0].text.match(/Rolled 1d6\+0: (\d+)/);
    if (match1 && parseInt(match1[1]) >= 1 && parseInt(match1[1]) <= 6) {
      console.log("✅ Test 2 passed: 1d6 roll is valid\n");
    } else {
      console.log("❌ Test 2 failed: 1d6 roll is invalid\n");
    }
    
    // Test 3: Roll 2d6+3
    console.log("Test 3: Roll 2d6+3");
    const result2: any = await client.callTool({
      name: "roll",
      arguments: {
        num_dice: 2,
        sides: 6,
        modifier: 3
      }
    });
    console.log("Result:", result2.content[0].text);
    
    // Parse the result to verify it's in the correct format
    const match2 = result2.content[0].text.match(/Rolled 2d6\+3: (\d+)/);
    if (match2 && parseInt(match2[1]) >= 5 && parseInt(match2[1]) <= 15) {
      console.log("✅ Test 3 passed: 2d6+3 roll is valid\n");
    } else {
      console.log("❌ Test 3 failed: 2d6+3 roll is invalid\n");
    }
    
    // Test 4: Roll 1d20
    console.log("Test 4: Roll 1d20");
    const result3: any = await client.callTool({
      name: "roll",
      arguments: {
        num_dice: 1,
        sides: 20
      }
    });
    console.log("Result:", result3.content[0].text);
    
    // Parse the result to verify it's in the correct format
    const match3 = result3.content[0].text.match(/Rolled 1d20\+0: (\d+)/);
    if (match3 && parseInt(match3[1]) >= 1 && parseInt(match3[1]) <= 20) {
      console.log("✅ Test 4 passed: 1d20 roll is valid\n");
    } else {
      console.log("❌ Test 4 failed: 1d20 roll is invalid\n");
    }
    
    console.log("All tests completed!");
    
  } catch (error) {
    console.error("Error during tests:", error);
  } finally {
    await client.close();
  }
}

runTests().catch(console.error);