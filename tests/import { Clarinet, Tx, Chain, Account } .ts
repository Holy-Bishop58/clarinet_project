import { Clarinet, Tx, Chain, Account } from "clarinet";
import { assertEquals, assertOk, assertErr } from "matchstick-as";

Clarinet.test({
  name: "Donor can add and recipient can confirm commitment",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const donor = accounts.get("deployer")!;
    const recipient = accounts.get("wallet_1")!;

    // Add commitment
    let block = chain.mineBlock([
      Tx.contractCall("aid-tracker", "add-commitment", ["u1", `'${recipient.address}`, "u100"], donor.address),
    ]);
    assertEquals(block.receipts.length, 1);
    assertOk(block.receipts[0].result, "ok true");

    // Confirm receipt by recipient
    block = chain.mineBlock([
      Tx.contractCall("aid-tracker", "confirm-receipt", ["u1"], recipient.address),
    ]);
    assertOk(block.receipts[0].result, "ok true");

    // Verify commitment is marked confirmed
    let call = chain.callReadOnlyFn("aid-tracker", "get-commitment", ["u1"], donor.address);
    call.result.expectSome().expectTuple()["confirmed"].expectBool(true);
  },
});
