import { useQuery } from '@tanstack/react-query';
import { Empty, Spin, Tabs } from 'antd';

import categoryService from '../../categories/category.service';

interface LibraryMaterialChildTabProps {
  parentId: number;
  activeChildTab?: number;
  setActiveChildTab: (id: number) => void;
}

export default function LibraryMaterialChildTab({
  parentId,
  activeChildTab,
  setActiveChildTab,
}: LibraryMaterialChildTabProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', parentId],
    queryFn: () =>
      categoryService.getManyCategories({
        parentId,
      }),
  });

  if (isLoading) return <Spin className="block my-6" />;
  if (isError) return <Empty description="Không thể tải danh mục con" />;

  if (!data?.data?.items?.length)
    return <Empty description="Không có danh mục con nào" />;

  return (
    <Tabs
      activeKey={activeChildTab?.toString()}
      onChange={(key) => setActiveChildTab(Number(key))}
      items={data.data.items.map((child) => ({
        label: child.name,
        key: child.id.toString(),
      }))}
      size="middle"
      className="child-category-tabs"
    />
  );
}
