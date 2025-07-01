import wallet from "../../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({ address: "https://devnet.irys.xyz/" }));
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        // Image URI from nft_image.ts
        const imageUri = "https://gateway.irys.xyz/4Y4cZdtQoYz55jYMU567qWqdbG2HvhT1GLj2aCeEkFUV";

        const metadata = {
            name: "Turbin3 Rug",
            symbol: "T3RUG",
            description: "Exotic rug ss",
            image: imageUri,
            attributes: [
                {trait_type: 'Color', value: 'pink'},
                {trait_type: 'Size', value: 'Large'},
                {trait_type: 'Pattern', value: 'random'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: imageUri
                    },
                ]
            },
            creators: [
                {
                    address: signer.publicKey,
                    share: 100
                }
            ]
        };

        // Upload metadata to Arweave
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
