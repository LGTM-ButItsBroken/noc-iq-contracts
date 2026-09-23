import { describe, it, expect } from "vitest";
import { SLACalculatorClient } from "../src/client";
import { CANONICAL_SEVERITIES, decodeContractError } from "../src/types";

describe("SLACalculatorClient", () => {
  const client = new SLACalculatorClient({
    contractId: "CABC1234567890ABCDEF",
    networkPassphrase: "Testnet ; SDF Network ; September 2015",
    rpcUrl: "https://soroban-testnet.stellar.org",
  });

  it("exposes contract address and network", () => {
    expect(client.contractAddress).toBe("CABC1234567890ABCDEF");
    expect(client.network).toContain("Testnet");
  });

  describe("configuration methods", () => {
    it("getConfig returns ok", async () => {
      const result = await client.getConfig("critical");
      expect(result.ok).toBe(true);
    });

    it("listConfigs returns ok", async () => {
      const result = await client.listConfigs();
      expect(result.ok).toBe(true);
    });

    it("getConfigSnapshot returns ok", async () => {
      const result = await client.getConfigSnapshot();
      expect(result.ok).toBe(true);
    });

    it("getConfigVersionHash returns ok", async () => {
      const result = await client.getConfigVersionHash();
      expect(result.ok).toBe(true);
    });

    it("getConfigCount returns ok", async () => {
      const result = await client.getConfigCount();
      expect(result.ok).toBe(true);
    });
  });

  describe("SLA calculation methods", () => {
    it("calculateSla returns ok", async () => {
      const result = await client.calculateSla(
        "operator1",
        "outage-001",
        "high",
        90,
      );
      expect(result.ok).toBe(true);
    });

    it("calculateSlaView returns ok", async () => {
      const result = await client.calculateSlaView(
        "outage-002",
        "critical",
        60,
      );
      expect(result.ok).toBe(true);
    });
  });

  describe("history methods", () => {
    it("getHistory returns ok", async () => {
      const result = await client.getHistory();
      expect(result.ok).toBe(true);
    });

    it("getHistoryPage returns ok", async () => {
      const result = await client.getHistoryPage(0, 10);
      expect(result.ok).toBe(true);
    });

    it("getHistoryByOutage returns ok", async () => {
      const result = await client.getHistoryByOutage("outage-001");
      expect(result.ok).toBe(true);
    });

    it("getLatestByOutage returns ok", async () => {
      const result = await client.getLatestByOutage("outage-001");
      expect(result.ok).toBe(true);
    });
  });

  describe("pause methods", () => {
    it("isPaused returns ok", async () => {
      const result = await client.isPaused();
      expect(result.ok).toBe(true);
    });

    it("getPauseInfo returns ok", async () => {
      const result = await client.getPauseInfo();
      expect(result.ok).toBe(true);
    });
  });

  describe("role methods", () => {
    it("getAdmin returns ok", async () => {
      const result = await client.getAdmin();
      expect(result.ok).toBe(true);
    });

    it("getOperator returns ok", async () => {
      const result = await client.getOperator();
      expect(result.ok).toBe(true);
    });
  });

  describe("version methods", () => {
    it("getVersionInfo returns ok", async () => {
      const result = await client.getVersionInfo();
      expect(result.ok).toBe(true);
    });

    it("getMigrationState returns ok", async () => {
      const result = await client.getMigrationState();
      expect(result.ok).toBe(true);
    });

    it("getStorageVersion returns ok", async () => {
      const result = await client.getStorageVersion();
      expect(result.ok).toBe(true);
    });
  });

  describe("types", () => {
    it("CANONICAL_SEVERITIES contains expected entries", () => {
      expect(CANONICAL_SEVERITIES).toEqual([
        "critical",
        "high",
        "medium",
        "low",
      ]);
    });
  });

  describe("getBatchSlaMetrics", () => {
    it("returns a map keyed by site ID", async () => {
      const result = await client.getBatchSlaMetrics([
        "site-1",
        "site-2",
        "site-3",
      ]);
      expect(result.ok).toBe(true);
      expect(result.value).toBeInstanceOf(Map);
      expect(Array.from(result.value!.keys())).toEqual([
        "site-1",
        "site-2",
        "site-3",
      ]);
    });

    it("returns an empty map for an empty input", async () => {
      const result = await client.getBatchSlaMetrics([]);
      expect(result.ok).toBe(true);
      expect(result.value!.size).toBe(0);
    });
  });

  describe("buildOutageReportTx", () => {
    it("returns a non-empty base64 envelope with defaults applied", () => {
      const envelope = client.buildOutageReportTx({
        source: "GABC1234567890",
        outageId: "outage-001",
        severity: "high",
        mttrMinutes: 45,
      });
      expect(envelope.envelopeXdr.length).toBeGreaterThan(0);
      expect(envelope.fee).toBe(100_000);
      expect(envelope.sequence).toBe("0");
    });

    it("honours custom fee and sequence overrides", () => {
      const envelope = client.buildOutageReportTx({
        source: "GABC1234567890",
        outageId: "outage-002",
        severity: "critical",
        mttrMinutes: 10,
        fee: 250_000,
        sequence: "42",
      });
      expect(envelope.fee).toBe(250_000);
      expect(envelope.sequence).toBe("42");
    });

    it("produces different envelopes for different outage IDs", () => {
      const a = client.buildOutageReportTx({
        source: "GABC1234567890",
        outageId: "outage-a",
        severity: "low",
        mttrMinutes: 5,
      });
      const b = client.buildOutageReportTx({
        source: "GABC1234567890",
        outageId: "outage-b",
        severity: "low",
        mttrMinutes: 5,
      });
      expect(a.envelopeXdr).not.toBe(b.envelopeXdr);
    });
  });
});

describe("decodeContractError", () => {
  it("maps known contract error codes to descriptive messages", () => {
    const decoded = decodeContractError(4);
    expect(decoded.name).toBe("ConfigNotFound");
    expect(decoded.message.length).toBeGreaterThan(0);
    expect(decoded.recommendedAction.length).toBeGreaterThan(0);
  });

  it("maps Unauthorized (#3)", () => {
    expect(decodeContractError(3).name).toBe("Unauthorized");
  });

  it("treats negative codes as Soroban host errors", () => {
    const decoded = decodeContractError(-32603);
    expect(decoded.name).toBe("HostError");
  });

  it("falls back to UnknownError for unrecognised positive codes", () => {
    const decoded = decodeContractError(9999);
    expect(decoded.name).toBe("UnknownError");
  });
});
