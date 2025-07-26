import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "get-friends-data",
  version: "1.0.0",
});

const getInformationByName = (name) => {
  const data = {
    rahul: {
      age: 24,
      profession: "Android Developer",
      gender: "male",
      hobbies: ["reading", "travelling"],
    },
    prathemesh: {
      age: 28,
      profession: "Data Scientist",
      gender: "female",
      hobbies: ["painting", "hiking", "coding side projects"],
    },
    amit: {
      age: 32,
      profession: "Marketing Manager",
      gender: "male",
      hobbies: ["playing cricket", "watching movies"],
    },
    sneha: {
      age: 25,
      profession: "UI/UX Designer",
      gender: "female",
      hobbies: ["photography", "exploring cafes", "yoga"],
    },
    vikram: {
      age: 35,
      profession: "Architect",
      gender: "male",
      hobbies: ["sketching", "cycling"],
    },
    anjali: {
      age: 30,
      profession: "Doctor",
      gender: "female",
      hobbies: ["gardening", "classical music"],
    },
    rohan: {
      age: 29,
      profession: "Product Manager",
      gender: "male",
      hobbies: ["playing chess", "listening to podcasts", "running"],
    },
    deepika: {
      age: 26,
      profession: "Graphic Designer",
      gender: "female",
      hobbies: ["digital illustration", "baking"],
    },
    aditya: {
      age: 27,
      profession: "Full Stack Developer",
      gender: "male",
      hobbies: ["gaming", "building mechanical keyboards"],
    },
    neha: {
      age: 31,
      profession: "QA Engineer",
      gender: "female",
      hobbies: ["dancing", "cooking", "blogging"],
    },
  };
  return data[name] || null;
};

server.tool(
  "getFriendDataByName",
  // FIX #1: Add z.object and a description for the entire tool
  z
    .object({
      friendName: z
        .string()
        .describe("The first name of the friend to look up, e.g., 'rahul'."),
    })
    .describe(
      "Gets all available information about a specific friend by their first name."
    ),

  async ({ friendName }) => {
    const friendData = await getInformationByName(friendName.toLowerCase());
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(friendData),
        },
      ],
    };
  }
);

// FIX #2: Remove console.log statements that interfere with stdio
const init = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

init();

//this final code
// how to use it
// copy main directory path where index.js is persent
