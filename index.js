/*
 * Provides different ways to generate addresses
 */

const bitcoin = require('bitcoinjs-lib');

const isCompressed = (node) => (node.keyPair && node.keyPair.compressed) ? true : node.compressed;

export const pubKeyToP2PKH = (pubKey, network) => {
  const scriptPubKey = bitcoin.script.pubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey));

  return bitcoin.address.fromOutputScript(scriptPubKey, network)
}

export const pubKeyToP2SHP2WPKH = (pubKey, network) => {
  const redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey)),
        scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript));

  return bitcoin.address.fromOutputScript(scriptPubKey, network);
}

export const pubKeyToP2WPKH = (pubKey, network) => {
  const scriptPubKey = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey))

  return bitcoin.address.fromOutputScript(scriptPubKey, network)
}

export const getAllPossibleAddressesFromPubKey = (pubKey, network) => [
  pubKeyToP2PKH(pubKey, network),
  pubKeyToP2SHP2WPKH(pubKey, network),
  pubKeyToP2WPKH(pubKey, network)
]

export const addressFunctionP2PKH = (node) => {
  const pubKey = node.getPublicKeyBuffer();
  return pubKeyToP2PKH(pubKey, node.getNetwork());
}

export const addressFunctionP2SHP2WPKH = (node) => {
  if (!isCompressed(node)) {
    throw('Cannot create P2SH-P2WPKH address from uncompressed key');
  }

  const pubKey = node.getPublicKeyBuffer();
  return pubKeyToP2SHP2WPKH(pubKey, node.getNetwork());
}

export const addressFunctionP2WPKH = (node) => {
  if (!isCompressed(node)) {
    throw('Cannot create P2WPKH address from uncompressed key');
  }

  const pubKey = node.getPublicKeyBuffer();
  return pubKeyToP2WPKH(pubKey, node.getNetwork());
}

export const signInputFunctionP2PKH = (sendTx, i, node) => {
  sendTx.sign(i, node);
}

export const signInputFunctionP2SHP2WPKH = (sendTx, i, node, inputValue) => {
  var pubKey = node.getPublicKeyBuffer();
  var pubKeyHash = bitcoin.crypto.hash160(pubKey);
  var redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash);

  sendTx.sign(i, node, redeemScript, null, inputValue);
}

export const signInputFunctionP2WPKH = (sendTx, i, node, inputValue) => {
  sendTx.sign(i, node, null, null, inputValue);
}

export const addInputFunctionP2PKH = (sendTx, input, sequence) => {
  sendTx.addInput(input.hash, input.index, sequence);
}

export const addInputFunctionP2SHP2WPKH = (sendTx, input, sequence) => {
  sendTx.addInput(input.hash, input.index, sequence);
}

export const addInputFunctionP2WPKH = (sendTx, input, sequence, node) => {
  const redeemScript = getP2WPKHRedeemScript(node);
  sendTx.addInput(input.hash, input.index, sequence, redeemScript);
}

const getP2WPKHRedeemScript = (node) => {
  const pubKey = node.getPublicKeyBuffer();
  const pubKeyHash = bitcoin.crypto.hash160(pubKey);
  const redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash);
  return redeemScript;
}
