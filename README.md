# dice-roller-mcp
An MCP server that rolls dice.

## Description
This is a Model Context Protocol (MCP) server that provides tools for rolling dice. It implements two tools:
1. `roll`: For rolling a single set of dice
2. `multi_roll`: For rolling multiple sets of dice in one call

Both tools take the following parameters:
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

## Tools
The server provides two tools:

### 1. `roll`
Rolls a single set of dice with an optional modifier.

Example tool calls:
- `roll(num_dice=2, sides=6)` - Rolls 2 six-sided dice
- `roll(num_dice=3, sides=6, modifier=1)` - Rolls 3 six-sided dice and adds 1 to the total

### 2. `multi_roll`
Rolls multiple sets of dice in a single call, which is more efficient for scenarios like generating D&D character stats.

Example tool calls:
- `multi_roll(rolls=[{num_dice=3, sides=6}, {num_dice=3, sides=6}, ...])` - Rolls 3d6 six times for D&D character stats
- `multi_roll(rolls=[{num_dice=2, sides=6, modifier=1}, {num_dice=1, sides=20, modifier=-2}])` - Rolls 2d6+1 and 1d20-2
