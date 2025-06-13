import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ConfigProvider, Empty, Spin, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/app/categories/category.service';
import LibraryMaterialChildTab from '@/modules/app/library-materials/components/library-material-child-tab';
import ScreenHeader from '@/shared/components/layouts/app/screen-header';

export const Route = createFileRoute('/_app/m/library/lectures/')({
  component: RouteComponent,
});

const tabTheme = {
  Tabs: {
    inkBarColor: '#8B4513',
    itemSelectedColor: '#8B4513',
    itemColor: '#666',
  },
};

function RouteComponent() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<number | undefined>(undefined);
  const [activeChildTab, setActiveChildTab] = useState<number | undefined>(
    undefined,
  );

  const parentCategoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      categoryService.getAllCategories({
        parentId: 18,
      }),
  });

  // Cập nhật tab đầu tiên khi có dữ liệu
  useEffect(() => {
    const firstId = parentCategoryQuery.data?.data?.items?.[0]?.id;
    if (firstId && activeTab === undefined) {
      setActiveTab(firstId);
    }
  }, [parentCategoryQuery.data, activeTab]);

  const childCategoryQuery = useQuery({
    queryKey: ['categories', activeTab],
    enabled: !!activeTab,
    queryFn: () =>
      categoryService.getAllCategories({
        parentId: activeTab!,
      }),
  });

  const parentTabs = useMemo(() => {
    if (!parentCategoryQuery.data?.data?.items) return [];
    return parentCategoryQuery.data.data.items.map((item) => ({
      label: item.name,
      key: item.id.toString(),
      children: (
        <LibraryMaterialChildTab
          parentId={item.id}
          activeChildTab={activeChildTab}
          setActiveChildTab={setActiveChildTab}
        />
      ),
    }));
  }, [parentCategoryQuery.data, activeChildTab]);

  return (
    <div>
      <ScreenHeader title="Bài giảng" showBackButton />

      <ConfigProvider theme={{ components: tabTheme }}>
        {parentCategoryQuery.isLoading ? (
          <Spin className="block text-center mt-8" />
        ) : parentCategoryQuery.isError ? (
          <Empty description="Không thể tải danh mục cha" />
        ) : (
          <Tabs
            activeKey={activeTab?.toString()}
            onChange={(key) => {
              setActiveTab(Number(key));
              setActiveChildTab(undefined); // reset child tab khi đổi cha
            }}
            items={parentTabs}
            tabBarGutter={24}
            size="large"
            className="category-tabs"
          />
        )}
      </ConfigProvider>
    </div>
  );
}
