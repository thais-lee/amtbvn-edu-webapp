import { Tag } from 'antd';

import { TCategory } from '../../categories/category.model';

interface LibraryMaterialChildTabProps {
  parentId: number;
  activeChildTab?: number;
  setActiveChildTab: (id: number) => void;
  childCategories: TCategory[];
}

export default function LibraryMaterialChildTab({
  parentId,
  activeChildTab,
  setActiveChildTab,
  childCategories,
}: LibraryMaterialChildTabProps) {
  return (
    <>
      <div
        className="child-category-tags-scroll"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 8,
          padding: '8px 0',
          whiteSpace: 'nowrap',
        }}
      >
        {childCategories.map((child) => (
          <Tag
            key={child.id}
            style={{
              cursor: 'pointer',
              fontWeight: activeChildTab === child.id ? 600 : 400,
              fontSize: 16,
              marginBottom: 0,
              userSelect: 'none',
              borderRadius: 10,
              padding: '4px 12px',
              background: activeChildTab === child.id ? '#a15318' : '#f0f0f0',
              color: activeChildTab === child.id ? '#fff' : '#222',
            }}
            onClick={() => setActiveChildTab(child.id)}
          >
            {child.name}
          </Tag>
        ))}
      </div>
    </>
  );
}
