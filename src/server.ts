import { createServer } from "./app"; 

const start = async () => {
  try {
    const app = await createServer(); 
    await app.listen({ port: 3000, host: '0.0.0.0' }); 

    const address = app.server.address();
    if (address && typeof address !== "string") {
      console.log(`🚀 Server running on http://20.206.248.157:${address.port}`);
      console.log(`📄 Docs: http://20.206.248.157:${address.port}/docs`);

      console.log(app.printRoutes());
    } else {
      console.log("Server address is not available.");
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start(); 