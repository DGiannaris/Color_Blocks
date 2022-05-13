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
    setStatus('Loading');
    
    if (!block.id) {
      return;
    }

    try {
      const response = await fetch(`/api/blocks/${block.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(block),
      })
      .then(result => {
        if (result.ok) {
          return result.json()
        }

        throw new Error('failed to patch')      
      });
       
      setStatus(response?.id && 'Success' )
    } catch (err) {
      console.log(err.message);
      setStatus('Fail')
    }

  }

  return {
    patchBlock,
    status
  }
}
