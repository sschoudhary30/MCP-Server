import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const server = new McpServer(
  {
    name: "email",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.tool(
  "getEmailByNames",
  "It takes the names of people and return the email of them respectively",
  {
    arrayOfFriendNames: z.array(z.string()).describe("Array of friend names"),
  },

  async ({ arrayOfFriendNames }) => {
    // ['shivam','suresh']
    // here we have two array one with name of friend and second array of data with name and email.
    const arrayOfEmails = [];
    const data = [
      {
        name: "me",
        email: "suresh12345x@gmail.com",
      },
      {
        name: "suresh",
        email: "sureshchoudhary.work@gmail.com",
      },
      {
        name: "shivam",
        email: "shivamamrutkar1@gmail.com",
      },
      {
        name: "rahul",
        email: "suresh12345x6@gmail.com",
      },
    ];

    arrayOfFriendNames.forEach((name) => {
      const result = data.find((value) => value.name == name.toLowerCase());
      if (result) {
        arrayOfEmails.push(result);
      }
    });

    return {
      content: [{ type: "text", text: JSON.stringify(arrayOfEmails) }],
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

const start = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

start();
