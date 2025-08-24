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
    
    const toolNames = tools.tools.map((t: any) => t.name);
    if (toolNames.includes("roll") && toolNames.includes("multi_roll")) {
      console.log("✅ Test 1 passed: roll and multi_roll tools are available\n");
    } else {
      console.log("❌ Test 1 failed: expected tools not found\n");
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
    
    // Test 5: Multi-roll (D&D character generation - 3d6 six times)
    console.log("Test 5: Multi-roll (3d6 x6 for D&D character)");
    const result4: any = await client.callTool({
      name: "multi_roll",
      arguments: {
        rolls: [
          { num_dice: 3, sides: 6 },
          { num_dice: 3, sides: 6 },
          { num_dice: 3, sides: 6 },
          { num_dice: 3, sides: 6 },
          { num_dice: 3, sides: 6 },
          { num_dice: 3, sides: 6 }
        ]
      }
    });
    console.log("Result:", result4.content[0].text);
    
    // Parse the result to verify it's in the correct format
    const lines = result4.content[0].text.split('\n');
    if (lines.length === 7 && lines[0] === "Multi-roll results:") {
      let allValid = true;
      for (let i = 1; i <= 6; i++) {
        const lineMatch = lines[i].match(/Roll \d+: 3d6\+0 = (\d+)/);
        if (!lineMatch || parseInt(lineMatch[1]) < 3 || parseInt(lineMatch[1]) > 18) {
          allValid = false;
          break;
        }
      }
      if (allValid) {
        console.log("✅ Test 5 passed: Multi-roll is valid\n");
      } else {
        console.log("❌ Test 5 failed: Multi-roll contains invalid results\n");
      }
    } else {
      console.log("❌ Test 5 failed: Multi-roll format is invalid\n");
    }
    
    // Test 6: Multi-roll with modifiers
    console.log("Test 6: Multi-roll with modifiers");
    const result5: any = await client.callTool({
      name: "multi_roll",
      arguments: {
        rolls: [
          { num_dice: 2, sides: 6, modifier: 1 },
          { num_dice: 1, sides: 20, modifier: -2 }
        ]
      }
    });
    console.log("Result:", result5.content[0].text);
    
    // Parse the result to verify it's in the correct format
    const lines2 = result5.content[0].text.split('\n');
    if (lines2.length === 3 && lines2[0] === "Multi-roll results:") {
      const match6_1 = lines2[1].match(/Roll 1: 2d6\+1 = (\d+)/);
      const match6_2 = lines2[2].match(/Roll 2: 1d20-2 = (\d+)/);
      if (match6_1 && match6_2 && 
          parseInt(match6_1[1]) >= 3 && parseInt(match6_1[1]) <= 13 &&
          parseInt(match6_2[1]) >= -1 && parseInt(match6_2[1]) <= 18) {
        console.log("✅ Test 6 passed: Multi-roll with modifiers is valid\n");
      } else {
        console.log("❌ Test 6 failed: Multi-roll with modifiers is invalid\n");
      }
    } else {
      console.log("❌ Test 6 failed: Multi-roll with modifiers format is invalid\n");
    }
    
    console.log("All tests completed!");
    
  } catch (error) {
    console.error("Error during tests:", error);
  } finally {
    await client.close();
  }
}

runTests().catch(console.error);