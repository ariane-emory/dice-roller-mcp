# dice-roller-mcp
An MCP server that rolls dice.

## Description
This is a Model Context Protocol (MCP) server that provides a tool for rolling dice. It implements a 'roll' tool that takes three arguments:
- `num_dice`: The number of dice to roll
- `sides`: The number of sides on each die
- `modifier`: An optional integer to add to the resulting total

This allows for rolling dice in a way equivalent to RPG dice notations like '3d6' or '2d6+1'.

## Installation
```bash
npm install
npm run build
```

## Usage
To start the server:
```bash
npm start
```

To run in development mode:
```bash
npm run dev
```

## Testing
To run the tests:
```bash
npm test
```

## Examples

### TypeScript Client
See `src/client-example.ts` for a TypeScript client example.

Run it with:
```bash
npm run client
```

### Python Client
See `example-python-client.py` for a Python client example.

Run it with:
```bash
python3 example-python-client.py
```

## Tool
The server provides a single tool:
- `roll`: Rolls dice with an optional modifier

Example tool calls:
- `roll(num_dice=2, sides=6)` - Rolls 2 six-sided dice
- `roll(num_dice=3, sides=6, modifier=1)` - Rolls 3 six-sided dice and adds 1 to the total
