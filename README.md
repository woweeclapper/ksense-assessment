Project Overview
This backend service is a TypeScript‑powered Node.js  application designed to fetch data from a remote API, authenticate using an API key, and compute a structured health assessment. The system parses temperature, age, and blood‑pressure data to generate a unified health score based on predefined scoring rules.

Features
TypeScript‑first architecture for type safety and maintainability

Secure API key authentication using request headers

Robust data fetching with retry logic for rate limits and transient failures

Health‑metric parsing for:

Temperature

Age

Blood pressure (systolic/diastolic)

Deterministic scoring engine that outputs a final health score

Modular utilities for validation, parsing, and error handling

Tech Stack
Node.js — backend runtime

TypeScript — static typing and compile‑time safety

Fetch API / node-fetch — HTTP requests

dotenv — environment variable management
