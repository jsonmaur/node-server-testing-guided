const supertest = require("supertest")
const server = require("../server")
const db = require("../data/config")

beforeEach(async () => {
	await db.seed.run()
})

beforeAll(async () => {
	await db.migrate.rollback()
	await db.migrate.latest()
})

afterAll(async () => {
	// close the database connection
	await db.destroy()
})

describe("hobbits integration tests", () => {
	it("gets a list of hobbits", async () => {
		const res = await supertest(server).get("/hobbits")
		expect(res.statusCode).toBe(200)
		expect(res.type).toBe("application/json")
		expect(res.body.length).toBeGreaterThanOrEqual(4)
		expect(res.body[0].id).toBe(1)
		expect(res.body[0].name).toBe("sam")
	})

	it("gets a single hobbit by id", async () => {
		const res = await supertest(server).get("/hobbits/2")
		expect(res.statusCode).toBe(200)
		expect(res.type).toBe("application/json")
		expect(res.body.id).toBe(2)
		expect(res.body.name).toBe("frodo")
	})

	it("returns an error for hobbit not found", async () => {
		const res = await supertest(server).get("/hobbits/50")
		expect(res.statusCode).toBe(404)
	})

	it("creates a hobbit", async () => {
		const res = await supertest(server)
			.post("/hobbits")
			.send({ name: "bilbo" })
		expect(res.statusCode).toBe(201)
		expect(res.type).toBe("application/json")
		expect(res.body.id).toBeDefined()
		expect(res.body.name).toBe("bilbo")
	})
})