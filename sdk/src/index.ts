/**
 * NOC IQ SLA Calculator — Offchain TypeScript SDK
 *
 * Typed async client for interacting with the SLA Calculator Soroban contract.
 * Provides ergonomic wrappers for all public contract methods.
 */

export { SLACalculatorClient } from "./client";
export type {
  ClientConfig,
  ContractResult,
  ContractFunctionSpec,
  ContractStructSpec,
  ContractSpec,
  StateSnapshot,
} from "./client";
export { MockSlaCalculatorClient } from "./mock-client";
export type { MockCallRecord, MockResponse } from "./mock-client";
export { generateTypeDefinitions } from "./typegen";
export type {
  TypeGenField,
  TypeGenStruct,
  TypeGenFunction,
  TypeGenSpec,
} from "./typegen";
export {
  CANONICAL_SEVERITIES,
  MAX_HISTORY_SIZE,
} from "./types";
export type {
  SLAConfig,
  SLAConfigEntry,
  SLAConfigSnapshot,
  SLAResult,
  SLAResultSchema,
  SLAStats,
  ContractMetadata,
  PauseInfo,
  StorageVersionInfo,
  FailureCode,
  FailureSchema,
  VersionInfo,
  Severity,
} from "./types";
