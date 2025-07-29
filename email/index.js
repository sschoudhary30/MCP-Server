import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import nodemailer from "nodemailer";

import XLSX from "xlsx";
import dotenv from "dotenv";
// Load APP_PASSWORD from .env file
dotenv.config({ path: ".env" });

console.log("IMMEDIATE CHECK after dotenv:", process.env.APP_PASSWORD);

const server = new McpServer(
  {
    name: "email",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

server.resource(
  "friends-data",
  "email://excel-data",
  {
    name: "Friends Excel files",
    describe: " Contain the data of friends with their respective emails.",
  },
  async (uri) => {
    const workbook = XLSX.readFile("friend-data.xlsx");
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(data),
          mimeType: "application/json",
        },
      ],
    };
  }
);
server.tool(
  "send-email",
  "send the email by email",
  {
    mailConfiguration: z.object({
      to: z.array(z.string()).describe("Email of recipient"),
      subject: z.string().describe("Subject of the email"),
      body: z.string().describe("Main content of the email"),
    }),
  },
  async ({ mailConfiguration }) => {
    const { to, subject, body } = mailConfiguration;
    try {
      // Debug log for environment variable
      console.log("APP_PASSWORD:", process.env.APP_PASSWORD);
      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, // fix hai ye
        auth: {
          user: "suresh12345x@gmail.com",
          pass: process.env.APP_PASSWORD, // this app password
        },
      });

      await transporter.sendMail({
        to: to,
        from: "suresh12345x@gmail.com",
        subject: subject,
        text: body,
      });

      return {
        content: [
          {
            type: "text",
            text: "Mail sent successfully",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: error.message,
          },
        ],
      };
    }
  }
);

server.prompt(
  "list-emails",
  "List the emails of friends by their names.",
  async () => {
    return {
      // assistent : mcp send to me
      // user: me send to mcp
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "list all my friend email ids by their names in alphabetical order",
          },
        },
      ],
    };
  }
);

server.prompt(
  "trip-planner",
  "send email for planning a trip.",
  {
    nameOfFriends: z.string().describe("Name of friends to send emails"),
    destination: z.string().describe("Destination of the trip"),
    noOfDays: z.string().describe("Number of days in a trip."),
    specialInstruction: z.string().describe("Any instruction in mail tone."),
  },
  async ({ nameOfFriends, destination, noOfDays, specialInstruction }) => {
    const prompt = `Send an emails to ${nameOfFriends} telling then that i have planned a trip of ${destination} for ${noOfDays}. convinve then to go with me.
    ${specialInstruction}`;

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: prompt,
          },
        },
      ],
    };
  }
);

const start = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

start();
