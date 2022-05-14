import * as React from 'react';
import { useData } from '../getters/useData.ts';
import { usePatchBlock } from '../setters/usePatchBlock.ts';
import { getRandomColor } from '../utils/getRandomColor.ts';
import { Block } from '../common/types.ts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * The main component of the assignment
 * It renders the blocks, uses the custom hooks to fetch/patch
 * and handles the local state to color change blocks
 * @returns {React.ReactElement}
 */
export const Dashboard = () => {
  const [newColor, setNewColor] = React.useState('');
  const [availableBlocks, setAvailableBlocks] = React.useState<Block[] | []>();
  const [clickedBlock, setClickedBlock] = React.useState<Block | undefined>();

  const {
    data: blocks = [],
    loading: isBlocksLoading,
    error: blocksError,
    fetchData: fetchBlocks,
  } = useData(`/api/blocks`, true, 30000);

  const { data: colorPool = [] } = useData(`/api/colors`);

  const { patchBlock, status } = usePatchBlock();

  React.useEffect(() => {
    if(clickedBlock?.id){
      patchBlock({ ...clickedBlock, color: newColor });
      fetchBlocks();
    }
  }, [clickedBlock]);

  React.useEffect(() => {
    // Sync local blocks with remote blocks
    // Used to make an optimistic color change
    if (blocks) {
      setAvailableBlocks([...blocks]);
    }
  }, [blocks]);

  React.useEffect(() => {
    switch (status) {
      case 'Success':
        toast.success(`${status}`, { position: toast.POSITION.TOP_CENTER });
        break;
      case 'Fail':
        toast.error(`${status}`, { position: toast.POSITION.TOP_CENTER });
        break;
    }
  }, [status]);

  return (
    <>
     <ToastContainer autoClose={500} />
      {
        <ul style={{ listStyleType: 'none', marginLeft: -40 }}>
          {availableBlocks?.map(({ name, id, color }) => {
            return (
              <li
                key={id}
                style={{
                  backgroundColor: `${color}`,
                  width: 40,
                  height: 40,
                  cursor: 'pointer',
                  borderRadius: 8,
                  userSelect: 'none',
                }}
                onClick={() => {
                  const maybeNewColor = getRandomColor(color, colorPool);
                  setClickedBlock({ id, name, color });
                  setNewColor(maybeNewColor);
                  const newavailableBlocks = [...availableBlocks];
                  const colorChangedAvailableBlocks = newavailableBlocks.map(
                    (block) => {
                      if (block.id === id) {
                        block.color = maybeNewColor;
                      }
                      return block;
                    }
                  );

                  setAvailableBlocks([...colorChangedAvailableBlocks]);
                }}
              >
                <p key={id} style={{ color: 'white', textAlign: 'center', lineHeight: 2.5 }}>
                  {name}
                </p>
              </li>
            );
          })}
        </ul>
      }
      {isBlocksLoading && <p>Fetching...</p>}
      {blocksError && <p>{`Error!: ${blocksError}`}</p>}
    </>
  );
};
