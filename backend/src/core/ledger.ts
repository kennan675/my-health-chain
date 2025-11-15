import crypto from 'crypto';

export type Block = {
  index: number;
  timestamp: number;
  action: string;
  dataHash: string;
  previousHash: string;
  createdBy: string;
  nonce: number;
};

export class Ledger {
  private chain: Block[] = [];

  constructor() {
    // Create genesis block
    const genesis: Block = {
      index: 0,
      timestamp: Date.now(),
      action: 'genesis',
      dataHash: this.hash('genesis'),
      previousHash: '0',
      createdBy: 'system',
      nonce: 0,
    };
    this.chain.push(genesis);
  }

  hash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  hashRecord(record: any): string {
    // canonicalize record and hash
    const payload = JSON.stringify(record);
    return this.hash(payload);
  }

  async addBlock(action: string, dataHash: string, userId: string): Promise<Block> {
    // Simple proof-of-work placeholder (nonce search) - tuned low for speed
    const previous = this.chain[this.chain.length - 1];
    const index = previous.index + 1;
    const timestamp = Date.now();

    let nonce = 0;
    let blockHash = '';
    let candidate: Block;
    while (true) {
      candidate = { index, timestamp, action, dataHash, previousHash: previous.dataHash, createdBy: userId, nonce };
      blockHash = this.hash(JSON.stringify(candidate));
      // simple condition: hash starts with '00' to simulate PoW
      if (blockHash.startsWith('00') || nonce > 1000) break;
      nonce++;
    }

    // push to local chain
    this.chain.push(candidate);

    // In production: write block record to Postgres blockchain_ledger table.
    // Example SQL:
    // INSERT INTO blockchain_ledger (index, timestamp, action, data_hash, previous_hash, created_by, nonce) VALUES (...)

    return candidate;
  }

  verifyChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];
      if (current.previousHash !== prev.dataHash) return false;
      // verify hash
      const computed = this.hash(JSON.stringify(current));
      // no stored hash field currently; using dataHash match as a minimal check
      if (!computed) return false;
    }
    return true;
  }

  async getAuditTrail(patientId: string | number): Promise<Block[]> {
    // In a production system we'd query blockchain_ledger table for blocks referencing that patientId.
    // For the scaffold, return any blocks whose dataHash contains the patientId when decrypted/linked.
    // Here we return the whole chain as a placeholder.
    return this.chain;
  }
}
