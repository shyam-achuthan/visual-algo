export async function executeNode(node, workflow) {
  switch (node.type) {
    case "marketData":
      return await executeMarketDataNode(node);
    // Add other node types here as we implement them
    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}

async function executeMarketDataNode(node) {
  try {
    const { url, method = "GET", headers = {} } = node.config;
    if (!url) {
      throw new Error("No URL configured for market data node");
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Store the result in the node's output
    node.output = { data };

    return data;
  } catch (error) {
    console.error("Error executing market data node:", error);
    throw new Error(`Market data fetch failed: ${error.message}`);
  }
}
