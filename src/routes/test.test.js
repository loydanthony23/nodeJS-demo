/**
 * Unit Tests for Test Routes
 * 
 * Tests the hello world endpoint to ensure it returns the expected response.
 */

import { strict as assert } from "assert";
import http from "http";
import app from "../app.js";

// Create HTTP server for testing
const server = http.createServer(app);

/**
 * Test: GET /api/test/hello should return hello world message
 */
function testHelloEndpoint(done) {
    server.listen(3001, () => {
        const options = {
            hostname: "localhost",
            port: 3001,
            path: "/api/test/hello",
            method: "GET",
        };

        const req = http.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    assert.equal(
                        response.message,
                        "Hello, world!",
                        "Expected message to be 'Hello, world!'"
                    );
                    assert.equal(res.statusCode, 200, "Expected status 200");
                    console.log("✅ Test passed: GET /api/test/hello");
                    server.close(done);
                } catch (err) {
                    console.error("❌ Test failed:", err.message);
                    server.close(() => done(err));
                }
            });
        });

        req.on("error", (err) => {
            console.error("❌ Request error:", err.message);
            server.close(() => done(err));
        });

        req.end();
    });
}

// Run the test
testHelloEndpoint((err) => {
    if (err) {
        process.exitCode = 1;
    } else {
        process.exitCode = 0;
    }
});
