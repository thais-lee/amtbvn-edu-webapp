import {
  ArrowLeftOutlined,
  CloseOutlined,
  DownloadOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  ConfigProvider,
  Empty,
  Image,
  List,
  Modal,
  Skeleton,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/app/categories/category.service';
import LibraryChildTabDesktop from '@/modules/app/library-materials/components/library-child-tab-desktop';
import libraryMaterialService from '@/modules/app/library-materials/library-material.service';
import { PageHeader } from '@/shared/components/layouts/app/page-header';

import '../styles.css';

export const Route = createFileRoute('/_app/d/library/images/')({
  component: RouteComponent,
});

const { Paragraph } = Typography;

const tabTheme = {
  components: {
    Tabs: {
      inkBarColor: '#8B4513',
      itemSelectedColor: '#8B4513',
      itemColor: '#666',
      horizontalItemGutter: 16,
      horizontalMargin: '0 0 0 0',
      horizontalItemPadding: '8px 0',
      cardPadding: '0',
    },
  },
};

function RouteComponent() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<number | undefined>(undefined);
  const [activeChildTab, setActiveChildTab] = useState<number | undefined>(
    undefined,
  );
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch parent categories (parentId = 21 for images)
  const parentCategoryQuery = useQuery({
    queryKey: ['categories-images'],
    queryFn: () => categoryService.getAllCategories({ parentId: 21 }),
  });

  // Fetch child categories for the selected parent
  const childCategoryQuery = useQuery({
    queryKey: ['categories-images', activeTab],
    enabled: !!activeTab,
    queryFn: () => categoryService.getAllCategories({ parentId: activeTab! }),
    select(data) {
      return data.data.items;
    },
  });

  // Determine if the active parent has children
  const hasChildren =
    childCategoryQuery.data &&
    childCategoryQuery.data.length > 0 &&
    !!activeTab;

  // Fetch library materials for the selected (child or parent) category
  const { data: libraryMaterials, isLoading: isMaterialsLoading } = useQuery({
    queryKey: [
      'library-materials-images',
      hasChildren ? activeChildTab : activeTab,
    ],
    queryFn: () =>
      libraryMaterialService.getAllLibraryMaterials({
        categoryId: hasChildren ? activeChildTab : activeTab,
        take: 20,
        skip: 0,
      }),
    enabled: !!(hasChildren ? activeChildTab : activeTab),
  });

  const downloadMutation = useMutation({
    mutationFn: ({
      materialId,
      fileId,
    }: {
      materialId: number;
      fileId: number;
    }) => {
      return libraryMaterialService.downloadFile(materialId, fileId);
    },
    onSuccess: (data) => {
      if (data.data?.url) {
        window.open(data.data.url, '_blank');
      }
    },
    onError: () => {
      messageApi.error(t('An error occurred'));
    },
  });

  useEffect(() => {
    const firstId = parentCategoryQuery.data?.data?.items?.[0]?.id;
    if (firstId && activeTab === undefined) {
      setActiveTab(firstId);
    }
  }, [parentCategoryQuery.data, activeTab]);

  // Memoize parent tabs for Tabs component
  const parentTabs = useMemo(() => {
    if (!parentCategoryQuery.data?.data?.items) return [];
    return parentCategoryQuery.data.data.items.map((item) => ({
      label: item.name,
      key: item.id.toString(),
      children: (
        <LibraryChildTabDesktop
          parentId={item.id}
          activeChildTab={activeChildTab}
          setActiveChildTab={setActiveChildTab}
          childCategories={childCategoryQuery.data || []}
        />
      ),
    }));
  }, [
    parentCategoryQuery.data?.data?.items,
    activeChildTab,
    childCategoryQuery.data,
  ]);

  return (
    <div className="library-screen">
      <div style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate({ to: '/d/library' })}
        >
          Quay lại
        </Button>
      </div>
      <PageHeader
        title={t('Image')}
        subtitle="Kho hình ảnh Phật giáo, hình minh họa, hình tư liệu"
      />
      <ConfigProvider theme={tabTheme}>
        <div>
          {parentCategoryQuery.isLoading ? (
            <Spin />
          ) : parentCategoryQuery.isError ? (
            <Empty description="Không thể tải danh mục cha" />
          ) : (
            <Tabs
              activeKey={activeTab?.toString()}
              onChange={(key) => {
                setActiveTab(Number(key));
                setActiveChildTab(undefined);
                setSelectedItem(null);
              }}
              items={parentTabs}
              tabBarGutter={24}
              style={{ marginBottom: 16 }}
              size="large"
            />
          )}
          <div style={{ marginTop: 24 }}>
            {isMaterialsLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <List
                grid={{ gutter: 24, column: 2 }}
                dataSource={libraryMaterials?.data?.items || []}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => setSelectedItem(item)}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      marginBottom: 24,
                    }}
                  >
                    <Image
                      src={item.files?.[0]?.storagePath}
                      alt={item.title}
                      width={'100%'}
                      height={300}
                      style={{
                        objectFit: 'cover',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        width: '100%',
                        background: '#f5f5f5',
                      }}
                      preview={false}
                      fallback="/assets/images/no-image.png"
                    />
                    <div
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: 500,
                        fontSize: 20,
                        marginTop: 16,
                        marginBottom: 8,
                        padding: '0 8px',
                      }}
                    >
                      {item.title}
                    </div>
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
        <Modal
          open={!!selectedItem}
          onCancel={() => setSelectedItem(null)}
          footer={null}
          centered
          styles={{ body: { padding: 0 } }}
          width={480}
          style={{ top: 0, maxWidth: 480 }}
          closeIcon={
            <button
              style={{
                background: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 10,
                cursor: 'pointer',
              }}
              aria-label="Close"
            >
              <CloseOutlined style={{ fontSize: 22, color: '#a15318' }} />
            </button>
          }
        >
          {selectedItem && (
            <div>
              <div style={{ padding: 24 }}>
                <Image
                  src={selectedItem.files?.[0]?.storagePath}
                  alt={selectedItem.title}
                  width={320}
                  style={{
                    objectFit: 'contain',
                    borderRadius: 8,
                    background: '#f5f5f5',
                  }}
                  preview={true}
                />
                <Space style={{ marginBottom: 12, marginTop: 12 }}>
                  {selectedItem.tags?.map((tag: string) => (
                    <Tag
                      key={tag}
                      color="gold"
                      style={{ borderRadius: 8, fontSize: 12 }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </Space>
                <div style={{ color: '#aaa', fontSize: 12, marginBottom: 4 }}>
                  {selectedItem.createdAt
                    ? dayjs(selectedItem.createdAt).format('DD/MM/YYYY')
                    : ''}
                </div>
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                  {selectedItem.title}
                </div>
                <Paragraph
                  style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
                >
                  {selectedItem.description}
                </Paragraph>
                {selectedItem.files?.[0] && (
                  <div style={{ marginTop: 12 }}>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        downloadMutation.mutate({
                          materialId: selectedItem.id,
                          fileId: selectedItem.files[0].id,
                        });
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: '#a15318',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      <DownloadOutlined style={{ marginRight: 6 }} />
                      {t('Download')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </ConfigProvider>
      {contextHolder}
    </div>
  );
}
