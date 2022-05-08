// Mui
import { Autocomplete, TextField } from '@mui/material';

import { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { queryTitles, queryTitle } from '@libs/atoms';

interface Title {
  type?: string;
  name?: string;
  count?: number;
}

export default function Grouped() {
  const [title, setTitle] = useRecoilState(queryTitle);
  const titles = useRecoilValue(queryTitles);

  const [inputValue, setInputValue] = useState('');

  return (
    <>
      {title && titles ? (
        <Autocomplete
          value={title}
          onChange={(_event, title) => {
            if (!title) return;
            setTitle(title);
          }}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={[...titles].sort(
            // @ts-ignore
            (a: Title, b: Title) =>
              a?.type && b?.type && -b?.type.localeCompare(a?.type)
          )}
          groupBy={(title) => title?.type}
          getOptionLabel={(title) => `${title?.name} (${title?.count})`}
          isOptionEqualToValue={(option, title) => option?.name === title?.name}
          sx={{ width: 400 }}
          renderInput={(params) => (
            <TextField {...params} label='Select title' />
          )}
        />
      ) : null}
    </>
  );
}
