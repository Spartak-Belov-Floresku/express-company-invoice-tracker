// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");

let testCompany;
let testInvoice;

beforeEach(async () => {

    const result1 = await db.query(
        `INSERT INTO companies (code, name, description) 
        VALUES ('tc', 'test_company', 'test_company llc') 
        RETURNING code, name, description`
    );
    testCompany = result1.rows[0];

    const result2 = await db.query(
        `INSERT INTO invoices (comp_code, amt) 
        VALUES ('${testCompany.code}', 100) 
        RETURNING id, comp_code, amt, paid, add_date, paid_date`
    );
    testInvoice = result2.rows[0];

});


/** GET /companies - returns `{companies: [{code, name}, ...]}` */
describe("GET /companies and /invoices", () => {

  test("Gets a list of 1 company", async () => {
    const response = await request(app).get(`/companies`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ companies: [testCompany] });
  });

  test("Gets a list of 1 invoice", async () => {
    const response = await request(app).get(`/invoices`);
    expect(response.statusCode).toEqual(200);
    expect(response.body.invoices[0].id).toEqual(testInvoice.id);
  });

});
// end


/** GET /companies/[code] - return data about one company: `{company: {code, ...}}` */
describe("GET /companies/:code and /invoices/:id", () => {
    test("Gets a single company", async () => {
      const response = await request(app).get(`/companies/${testCompany.code}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body.company.code).toEqual(testCompany.code);
    });

    test("Gets a single invoice", async () => {
        const response = await request(app).get(`/invoices/${testInvoice.id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.invoice.company.code).toEqual(testCompany.code);
      });
  
    test("Responds with 404 if can't find company", async () => {
      const response = await request(app).get(`/company/cola`);
      expect(response.statusCode).toEqual(404);
    });

    test("Responds with 404 if can't find invoice", async () => {
        const response = await request(app).get(`/invices/10`);
        expect(response.statusCode).toEqual(404);
      });
  });
// end


/** POST /company - create company from data; return `{company: {code, ...}}` */
describe("POST /companies and /invoices", () => {

    test("Creates a new company", async () => {
      const response = await request(app)
        .post(`/companies`)
        .send({
          code: "cc",
          name:"coca-cola",
          description:"coca-cola llc"
        });
      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({company: {code:"cc", name:"coca-cola", description: "coca-cola llc"}});
    });

    test("Creates a new invoice", async () => {
        const response = await request(app)
          .post(`/invoices`)
          .send({
            comp_code: testCompany.code,
            amt:100
          });
        expect(response.statusCode).toEqual(201);
        expect(response.body.invoice.comp_code).toEqual(testCompany.code);
    });

  });
// end


/** PUT /companies/[code] - update company; return `{company: {code, ...}}` */
describe("PUT /company/:code and /invoices/:id", () => {
    test("Updates a single company", async () => {
      const response = await request(app)
        .put(`/companies/${testCompany.code}`)
        .send({
          name: "new_test_company",
          description: "new llc",
        });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({company: {code: testCompany.code, name: "new_test_company", description: "new llc"}});
    });

    test("Updates a single invoice", async () => {
        const response = await request(app)
          .put(`/invoices/${testInvoice.id}`)
          .send({
            amt: 105
          });
        expect(response.statusCode).toEqual(200);
        expect(response.body.invoice.amt).toEqual(105);
    });
  
    test("Responds with 404 if can't find company", async () => {
      const response = await request(app).patch(`/companies/cola`);
      expect(response.statusCode).toEqual(404);
    });

    test("Responds with 404 if can't find invoice", async () => {
        const response = await request(app).patch(`/invoices/10`);
        expect(response.statusCode).toEqual(404);
    });

  });
// end


/** DELETE /companies/[code] - delete company,
*  return `{ status: "deleted"}` */
describe("DELETE /companies/:code and /invoices/:id", () => {

    test("Deletes a single a company", async () => {
      const response = await request(app)
        .delete(`/companies/${testCompany.code}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({status: "deleted"});
    });

    test("Deletes a single a invoice", async () => {
        const response = await request(app)
          .delete(`/invoices/${testInvoice.id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({status: "deleted"});
    });

  });
// end

afterEach(async () => {
  // delete any data created by test
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
});

afterAll(async () => {
  // close db connection
  await db.end();
});
