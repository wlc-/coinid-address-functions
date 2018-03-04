/*
 * Provides different ways to generate addresses
 */

const bitcoin = require('bitcoinjs-lib');

export const addressFunctionP2PKH = (node) => {
  const pubKey = node.getPublicKeyBuffer(),
        scriptPubKey = bitcoin.script.pubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey));

  return bitcoin.address.fromOutputScript(scriptPubKey, node.getNetwork())
}

export const addressFunctionP2SHP2WPKH = (node) => {
  const pubKey = node.getPublicKeyBuffer(),
        redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey)),
        scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript));

  return bitcoin.address.fromOutputScript(scriptPubKey, node.getNetwork());
}

export const addressFunctionP2WPKH = (node) => {
  const pubKey = node.getPublicKeyBuffer(),
        scriptPubKey = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey))

  return bitcoin.address.fromOutputScript(scriptPubKey, node.getNetwork())
}