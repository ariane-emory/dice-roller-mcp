import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Dice roll function that takes number of dice, sides, and modifier
function roll_dice(num_dice: number, sides: number, modifier: number): number {
  let total = modifier;
  for (let i = 0; i < num_dice; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

// Create the MCP server
const server = new McpServer(
  {
    name: "dice-roller",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register the roll tool (single roll)
server.tool(
  "roll",
  "Rolls dice with optional modifier (e.g., 2d6+1)",
  {
    num_dice: z.number().int().positive(),
    sides: z.number().int().positive(),
    modifier: z.number().int().optional().default(0),
  },
  async (args): Promise<CallToolResult> => {
    const { num_dice, sides, modifier } = args;
    
    const result = roll_dice(num_dice, sides, modifier);
    
    return {
      content: [{
        type: "text",
        text: `Rolled ${num_dice}d${sides}${modifier >= 0 ? '+' : ''}${modifier}: ${result}`
      }]
    };
  }
);

// Register the multi_roll tool (multiple rolls in one call)
server.tool(
  "multi_roll",
  "Rolls multiple sets of dice (e.g., 3d6 six times for a D&D character)",
  {
    rolls: z.array(z.object({
      num_dice: z.number().int().positive(),
      sides: z.number().int().positive(),
      modifier: z.number().int().optional().default(0),
    })),
  },
  async (args): Promise<CallToolResult> => {
    const { rolls } = args;
    
    const results = rolls.map((roll, index) => {
      const { num_dice, sides, modifier } = roll;
      const result = roll_dice(num_dice, sides, modifier);
      return `Roll ${index + 1}: ${num_dice}d${sides}${modifier >= 0 ? '+' : ''}${modifier} = ${result}`;
    });
    
    return {
      content: [{
        type: "text",
        text: "Multi-roll results:\n" + results.join('\n')
      }]
    };
  }
);

// Start the server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch(console.error);