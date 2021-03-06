import { get, omitBy, sortBy } from "lodash";
import { flatten } from "flat";
import { sha3 } from "ethereumjs-util";

export const flattenHashArray = data => {
  const flattenedData = omitBy(
    flatten(data),
    (value, key) => value === undefined || key === undefined
  );
  return Object.keys(flattenedData).map(k => {
    const obj = {};
    obj[k] = flattenedData[k];
    return sha3(JSON.stringify(obj)).toString("hex");
  });
};

export const digestDocument = document => {
  // Prepare array of hashes from filtered data
  const hashedDataArray = get(document, "privacy.obfuscatedData", []);

  // Prepare array of hashes from visible data
  const unhashedData = get(document, "data");
  const hashedUnhashedDataArray = flattenHashArray(unhashedData);

  // Combine both array and sort them to ensure determinism
  const combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  const digest = sha3(JSON.stringify(sortedHashes)).toString("hex");
  return digest;
};
