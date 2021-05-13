const supertest = require("supertest")
const server = require("../server")

describe("hobbit integration tests", () => {
	it("gets all hobbits", async () => {
		const res = await supertest(server).get("/hobbits")
		expect(res.statusCode).toBe(200)
		expect(res.type).toBe("application/json")
		expect(res.body.length).toBeGreaterThanOrEqual(4)
		expect(res.body[0].name).toBe("sam")
	})

	it("gets hobbit by ID", async () => {
		const res = await supertest(server).get("/hobbits/2")
		expect(res.statusCode).toBe(200)
		expect(res.type).toBe("application/json")
		expect(res.body.id).toBe(2)
		expect(res.body.name).toBe("frodo")
	})

	it("returns a 404 for missing hobbit", async () => {
		const res = await supertest(server).get("/hobbits/50")
		expect(res.statusCode).toBe(404)
	})

	it("creates a new hobbit", async () => {
		const res = await supertest(server)
			.post("/hobbits")
			.send({ name: "bilbo" })
		expect(res.statusCode).toBe(201)
		expect(res.type).toBe("application/json")
		expect(res.body.name).toBe("bilbo")
		expect(res.body.id).toBeDefined()
	})
})