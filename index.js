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
  var pubKey = node.getPublicKeyBuffer();
  var pubKeyHash = bitcoin.crypto.hash160(pubKey);
  var redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash);

  sendTx.sign(i, node, redeemScript, null, inputValue);
}