import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { vars } from '@fractalui/tokens';
import { Search } from '@fractalui/patterns';

const meta: Meta = { title: 'Patterns/Search' };
export default meta;

export const WithFilter: StoryObj = {
  render: function SearchStory() {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.md, maxWidth: 480 }}>
        <Search value={value} onChange={setValue} onSubmit={setSubmitted} onFilter={() => {}} />
        <span style={{ color: vars.color.muted, fontSize: vars.font.sizeSm }}>
          Отправлено (Enter): {submitted || '—'}
        </span>
      </div>
    );
  },
};
