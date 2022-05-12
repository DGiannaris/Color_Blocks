import * as React from 'react';
import { Block } from '../common/types.ts';

/**
 * A custom hook to patch a specific block
 * exposes the patch function and the status of the response
 * @returns {patchBlock, status}
 */
export const usePatchBlock = () => {
  const [status, setStatus] = React.useState('');

  const patchBlock = async (block: Block) => {
    if (!block.id) {
      return;
    }

    try {
      const response = await fetch(`/api/blocks/${block.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(block),
      })
        .then((res) => {
          return res.json()
        })

      setStatus(response?.id && 'Success')
    } catch (err) {
      console.log({ err });
    }

  }

  return {
    patchBlock,
    status
  }
}
