import * as React from 'react';
import { useData } from '../getters/useData.ts';
import { usePatchBlock } from '../setters/usePatchBlock.ts';
import { getRandomColor } from '../utils/getRandomColor.ts';
import { Block } from '../common/types.ts';

export const Dashboard = () => {
  const [newColor, setNewColor] = React.useState('');
  const [availableBlocks, setAvailableBlocks] = React.useState<Block[] | []>();
  const [clickedBlock, setClickedBlock] = React.useState<Block | undefined>();

  const {
    data: blocks = [],
    loading: isBlocksLoading,
    error: blocksError,
    fetchData: fetchBlocks,
  } = useData(`/api/blocks`, true);

  const { data: colorPool = [] } = useData(`/api/colors`);

  const { patchBlock, status } = usePatchBlock();

  React.useEffect(() => {
    patchBlock({ ...clickedBlock, color: newColor });
    fetchBlocks();
  }, [newColor, clickedBlock]);

  React.useEffect(() => {
    // Sync local blocks with remote blocks
    // Used to make an optimistic color change
    if (blocks) {
      setAvailableBlocks([...blocks]);
    }
  }, [blocks]);

  return (
    <>
      {
        <ul style={{ listStyleType: 'none' }}>
          {availableBlocks?.map(({ name, id, color }) => {
            return (
              <li
                key={id}
                style={{
                  backgroundColor: `${color}`,
                  width: 30,
                  height: 30,
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
                <p
                  key={id}
                  style={{ color: 'white', textAlign: 'center', lineHeight: 2 }}
                >
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
