/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface MasterGatewayInterface extends utils.Interface {
  functions: {
    "amBridgeAddress()": FunctionFragment;
    "chainIdToGateway(uint256)": FunctionFragment;
    "getGateway(uint256)": FunctionFragment;
    "indexToChainId(uint256)": FunctionFragment;
    "lastIndex()": FunctionFragment;
    "masterCrosschainGranter()": FunctionFragment;
    "owner()": FunctionFragment;
    "receiveMessage(bytes)": FunctionFragment;
    "registerForeignGateway(uint256,address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "sendMessageToForeignGateway(uint256,bytes)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "amBridgeAddress"
      | "chainIdToGateway"
      | "getGateway"
      | "indexToChainId"
      | "lastIndex"
      | "masterCrosschainGranter"
      | "owner"
      | "receiveMessage"
      | "registerForeignGateway"
      | "renounceOwnership"
      | "sendMessageToForeignGateway"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "amBridgeAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "chainIdToGateway",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getGateway",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "indexToChainId",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "lastIndex", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "masterCrosschainGranter",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "receiveMessage",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "registerForeignGateway",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sendMessageToForeignGateway",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "amBridgeAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "chainIdToGateway",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getGateway", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "indexToChainId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lastIndex", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "masterCrosschainGranter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "receiveMessage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerForeignGateway",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sendMessageToForeignGateway",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "ForeignGatewayRegistered(uint256,address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ForeignGatewayRegistered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface ForeignGatewayRegisteredEventObject {
  chainId: BigNumber;
  foreignGateway: string;
}
export type ForeignGatewayRegisteredEvent = TypedEvent<
  [BigNumber, string],
  ForeignGatewayRegisteredEventObject
>;

export type ForeignGatewayRegisteredEventFilter =
  TypedEventFilter<ForeignGatewayRegisteredEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface MasterGateway extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MasterGatewayInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    amBridgeAddress(overrides?: CallOverrides): Promise<[string]>;

    chainIdToGateway(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getGateway(
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    indexToChainId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    lastIndex(overrides?: CallOverrides): Promise<[BigNumber]>;

    masterCrosschainGranter(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    receiveMessage(
      _message: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    registerForeignGateway(
      chainId: BigNumberish,
      foreignGateway: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    sendMessageToForeignGateway(
      chainId: BigNumberish,
      _message: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  amBridgeAddress(overrides?: CallOverrides): Promise<string>;

  chainIdToGateway(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getGateway(chainId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  indexToChainId(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  lastIndex(overrides?: CallOverrides): Promise<BigNumber>;

  masterCrosschainGranter(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  receiveMessage(
    _message: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  registerForeignGateway(
    chainId: BigNumberish,
    foreignGateway: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  sendMessageToForeignGateway(
    chainId: BigNumberish,
    _message: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    amBridgeAddress(overrides?: CallOverrides): Promise<string>;

    chainIdToGateway(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getGateway(
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    indexToChainId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lastIndex(overrides?: CallOverrides): Promise<BigNumber>;

    masterCrosschainGranter(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    receiveMessage(
      _message: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    registerForeignGateway(
      chainId: BigNumberish,
      foreignGateway: string,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    sendMessageToForeignGateway(
      chainId: BigNumberish,
      _message: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ForeignGatewayRegistered(uint256,address)"(
      chainId?: null,
      foreignGateway?: null
    ): ForeignGatewayRegisteredEventFilter;
    ForeignGatewayRegistered(
      chainId?: null,
      foreignGateway?: null
    ): ForeignGatewayRegisteredEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    amBridgeAddress(overrides?: CallOverrides): Promise<BigNumber>;

    chainIdToGateway(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getGateway(
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    indexToChainId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lastIndex(overrides?: CallOverrides): Promise<BigNumber>;

    masterCrosschainGranter(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    receiveMessage(
      _message: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    registerForeignGateway(
      chainId: BigNumberish,
      foreignGateway: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    sendMessageToForeignGateway(
      chainId: BigNumberish,
      _message: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    amBridgeAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    chainIdToGateway(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getGateway(
      chainId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    indexToChainId(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lastIndex(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    masterCrosschainGranter(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    receiveMessage(
      _message: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    registerForeignGateway(
      chainId: BigNumberish,
      foreignGateway: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    sendMessageToForeignGateway(
      chainId: BigNumberish,
      _message: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
