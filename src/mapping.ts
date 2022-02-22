import { BigInt } from "@graphprotocol/graph-ts"
import {
  Cancel,
  Match
} from "../generated/UniverseMarketplace/UniverseMarketplace"
import { OrderMatchEntity, OrderCancelEntity } from "../generated/schema"

export function handleOrderMatch(event: Match): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = OrderMatchEntity.load(event.transaction.hash.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new OrderMatchEntity(event.transaction.hash.toHex())
  }

  // Entity fields can be set based on event parameters
  entity.leftOrderHash = event.params.leftHash;
  entity.rightOrderHash = event.params.rightHash;
  entity.leftMaker = event.params.leftMaker;
  entity.rightMaker = event.params.rightMaker;
  entity.newLeftFill = event.params.newLeftFill;
  entity.newRightFill = event.params.newRightFill;
  entity.leftAssetClass = event.params.leftAsset.assetClass;
  entity.rightAssetClass = event.params.rightAsset.assetClass;
  entity.leftAssetData = event.params.leftAsset.data;
  entity.rightAssetData = event.params.rightAsset.data;
  
  entity.txFrom = event.transaction.from;
  entity.txValue = event.transaction.value;

  entity.blockNumber = event.block.number.toI32()
  entity.blockTimestamp = event.block.timestamp.toI32()

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.admin(...)
  // - contract.implementation(...)
}

export function handleOrderCancel(event: Cancel): void {
  let entity = OrderCancelEntity.load(event.transaction.hash.toHex())

  if (entity == null) {
    entity = new OrderCancelEntity(event.transaction.hash.toHex())
  }

  entity.leftOrderHash = event.params.hash;
  entity.leftMaker = event.params.maker;
  entity.leftAssetClass = event.params.makeAssetType.assetClass;
  entity.rightAssetClass = event.params.takeAssetType.assetClass;
  entity.leftAssetData = event.params.makeAssetType.data;
  entity.rightAssetData = event.params.takeAssetType.data;

  entity.txFrom = event.transaction.from;
  entity.txValue = event.transaction.value;

  entity.blockNumber = event.block.number.toI32();
  entity.blockTimestamp = event.block.timestamp.toI32();

  entity.save()
}
