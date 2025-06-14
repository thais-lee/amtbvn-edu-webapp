import { Tag } from 'antd';

import { TCategory } from '../../categories/category.model';

interface LibraryChildTabDesktopProps {
  parentId: number;
  activeChildTab?: number;
  setActiveChildTab: (id: number) => void;
  childCategories: TCategory[];
}

export default function LibraryChildTabDesktop({
  parentId,
  activeChildTab,
  setActiveChildTab,
  childCategories,
}: LibraryChildTabDesktopProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 16,
        marginBottom: 0,
        background: 'none',
        padding: 0,
      }}
    >
      {childCategories.map((child) => (
        <Tag
          key={child.id}
          style={{
            cursor: 'pointer',
            fontWeight: activeChildTab === child.id ? 600 : 400,
            fontSize: 14,
            margin: 0,
            userSelect: 'none',
            borderRadius: 8,
            padding: '6px 16px',
            background: activeChildTab === child.id ? '#a15318' : 'none',
            color: activeChildTab === child.id ? '#fff' : '#333',
            border: 'none',
            transition: 'all 0.3s ease',
            boxShadow:
              activeChildTab === child.id
                ? '0 2px 8px rgba(161, 83, 24, 0.2)'
                : 'none',
          }}
          onClick={() => setActiveChildTab(child.id)}
        >
          {child.name}
        </Tag>
      ))}
    </div>
  );
}
