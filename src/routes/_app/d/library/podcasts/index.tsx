import {
  ArrowLeftOutlined,
  CloseOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Empty,
  List,
  Modal,
  Row,
  Skeleton,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/app/categories/category.service';
import LibraryChildTabDesktop from '@/modules/app/library-materials/components/library-child-tab-desktop';
import libraryMaterialService from '@/modules/app/library-materials/library-material.service';

const { Title, Paragraph } = Typography;

const tabTheme = {
  Tabs: {
    inkBarColor: '#8B4513',
    itemSelectedColor: '#8B4513',
    itemColor: '#666',
  },
};

export const Route = createFileRoute('/_app/d/library/podcasts/')({
  component: PodcastsDesktopPage,
});

function PodcastsDesktopPage() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<number | undefined>(undefined);
  const [activeChildTab, setActiveChildTab] = useState<number | undefined>(
    undefined,
  );
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { antdApp } = useApp();
  const { message } = antdApp;

  // Fetch parent categories (parentId = 22 for podcasts)
  const parentCategoryQuery = useQuery({
    queryKey: ['categories-podcasts'],
    queryFn: () => categoryService.getAllCategories({ parentId: 22 }),
  });

  // Fetch child categories for the selected parent
  const childCategoryQuery = useQuery({
    queryKey: ['categories-podcasts', activeTab],
    enabled: !!activeTab,
    queryFn: () => categoryService.getAllCategories({ parentId: activeTab! }),
    select(data) {
      return data.data.items;
    },
  });

  // Fetch podcasts (library materials) for the selected category
  const hasChildren =
    childCategoryQuery.data &&
    childCategoryQuery.data.length > 0 &&
    !!activeTab;
  const { data: libraryMaterials, isLoading: isMaterialsLoading } = useQuery({
    queryKey: [
      'library-materials-podcasts',
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
      message.error(t('An error occurred'));
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
      <Title level={2} style={{ marginBottom: 24 }}>
        Podcasts
      </Title>
      <ConfigProvider theme={{ components: tabTheme }}>
        <div className="">
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
                dataSource={libraryMaterials?.data?.items || []}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => setSelectedItem(item)}
                    style={{
                      padding: 20,
                      borderRadius: 12,
                      marginBottom: 16,
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ marginRight: 20 }}>
                      <PlayCircleOutlined
                        style={{ fontSize: 44, color: '#a15318' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 18,
                          marginBottom: 2,
                        }}
                      >
                        {item.title}
                      </div>
                      <Paragraph
                        style={{ margin: 0, color: '#888' }}
                        ellipsis={{ rows: 2 }}
                      >
                        {item.description}
                      </Paragraph>
                      <Space style={{ marginTop: 8, marginBottom: 0 }} wrap>
                        {item.tags?.map((tag: string) => (
                          <Tag
                            key={tag}
                            color="gold"
                            style={{ borderRadius: 8, fontSize: 12 }}
                          >
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                      <div
                        style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}
                      >
                        {item.createdAt
                          ? dayjs(item.createdAt).format('DD/MM/YYYY')
                          : ''}
                      </div>
                      <audio
                        src={item.files?.[0]?.storagePath}
                        controls
                        style={{ width: '100%', marginTop: 12 }}
                      />
                    </div>
                  </List.Item>
                )}
              />
            )}
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
                  <Space style={{ marginBottom: 12 }}>
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
                  <div
                    style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}
                  >
                    {selectedItem.title}
                  </div>
                  <Paragraph
                    style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
                  >
                    {selectedItem.description}
                  </Paragraph>
                  {selectedItem.files?.[0] && (
                    <div style={{ marginTop: 12 }}>
                      <audio
                        src={selectedItem.files[0].storagePath}
                        controls
                        style={{ width: '100%' }}
                      />
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() =>
                          downloadMutation.mutate({
                            materialId: selectedItem.id,
                            fileId: selectedItem.files[0].id,
                          })
                        }
                        style={{ marginTop: 12 }}
                      >
                        {t('Download')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal>
        </div>
      </ConfigProvider>
    </div>
  );
}
