import assert from 'assert'
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { MetadataProgram, DataV2, Metadata, MasterEdition } from "@metaplex-foundation/mpl-token-metadata";
import { UnimoonBase } from '../target/types/unimoon_base';
import { MediaObjects } from '../target/types/media_objects';

describe('unimoon-contracts', () => {
  const provider = anchor.Provider.env()
  anchor.setProvider(provider);

  const program0 = anchor.workspace.UnimoonBase as Program<UnimoonBase>;
  const program2 = anchor.workspace.MediaObjects as Program<MediaObjects>;

  let _post: anchor.web3.Keypair;
  let _unimoonUsers;
  let _unimoonPosts;

  it("Initialize Users", async () => {
    const unimoonUsers = anchor.web3.Keypair.generate()
    const size = 1000000 + 8; // Account size in bytes.

    const tx = await program0.rpc.initializeUsers({
      accounts: {
        unimoonUsers: unimoonUsers.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      },
      instructions: [
        await program0.account.unimoonUsers.createInstruction(unimoonUsers, size)
      ],
      signers: [unimoonUsers]
    });
    console.log("Your transaction signature", tx);

    _unimoonUsers = unimoonUsers;
  });

  it("Initialize Posts", async () => {
    const unimoonPosts = anchor.web3.Keypair.generate()
    const size = 1000000 + 8; // Account size in bytes.

    const tx = await program0.rpc.initializePosts({
      accounts: {
        unimoonPosts: unimoonPosts.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      },
      instructions: [
        await program0.account.unimoonPosts.createInstruction(unimoonPosts, size)
      ],
      signers: [unimoonPosts]
    });
    console.log("Your transaction signature", tx);

    _unimoonPosts = unimoonPosts;
  });

  it('Create a post', async () => {
    const mint = anchor.web3.Keypair.generate();
    const post = anchor.web3.Keypair.generate();

    const [authority] = (await anchor.web3.PublicKey.findProgramAddress([
      Buffer.from("auth"),
    ], program2.programId));

    const tokenAccount = (await anchor.web3.PublicKey.findProgramAddress([
      authority.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mint.publicKey.toBuffer()
    ], ASSOCIATED_TOKEN_PROGRAM_ID))[0];

    const data = new DataV2({
      name: "Collection",
      symbol: "NFT",
      uri: "https://uri",
      sellerFeeBasisPoints: 1000,
      creators: null,
      collection: null,
      uses: null
    });

    const metadataAccount = await Metadata.getPDA(mint.publicKey);
    const editionAccount = await MasterEdition.getPDA(mint.publicKey);

    // @ts-ignore
    const tx = await program2.methods.createPost(data, true, null).accounts({
      post: post.publicKey,
      authority,
      mint: mint.publicKey,
      tokenAccount,
      metadataAccount,
      editionAccount,
      metadataProgram: MetadataProgram.PUBKEY,
    }).signers([mint, post]).rpc();
    console.log("Your transaction signature", tx);

    _post = post
  })

  it('Act a post', async () => {
    const post = _post
    const user = anchor.web3.Keypair.generate()
    const tx = await program2.rpc.actPost({ 'view': {} }, {
      accounts: {
        post: post.publicKey,
        from: user.publicKey
      },
      signers: [user]
    })

    console.log("Your transaction signature", tx);
  })
});
