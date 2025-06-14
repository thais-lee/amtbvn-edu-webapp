import {
  CloseOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  Button,
  ConfigProvider,
  Empty,
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
import { IoArrowBack } from 'react-icons/io5';

import useApp from '@/hooks/use-app';
import categoryService from '@/modules/app/categories/category.service';
import LibraryMaterialChildTab from '@/modules/app/library-materials/components/library-material-child-tab';
import libraryMaterialService from '@/modules/app/library-materials/library-material.service';

export const Route = createFileRoute('/_app/m/library/talks/')({
  component: RouteComponent,
});

const { Paragraph, Title } = Typography;

const tabTheme = {
  Tabs: {
    inkBarColor: '#8B4513',
    itemSelectedColor: '#8B4513',
    itemColor: '#666',
  },
};

function isAudio(file: any) {
  return file?.mimeType?.startsWith('audio');
}

function isVideo(file: any) {
  return file?.mimeType?.startsWith('video');
}

function RouteComponent() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<number | undefined>(undefined);
  const [activeChildTab, setActiveChildTab] = useState<number | undefined>(
    undefined,
  );
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Fetch parent categories (parentId = 23 for talks, adjust as needed)
  const parentCategoryQuery = useQuery({
    queryKey: ['categories-talks'],
    queryFn: () => categoryService.getAllCategories({ parentId: 23 }),
  });

  // Fetch child categories for the selected parent
  const childCategoryQuery = useQuery({
    queryKey: ['categories-talks', activeTab],
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
      'library-materials-talks',
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

  useEffect(() => {
    if (activeChildTab) {
      setActiveChildTab(activeChildTab);
    }
  }, [activeChildTab]);

  // Build parent tabs, showing child categories if present
  const parentTabs = useMemo(() => {
    if (!parentCategoryQuery.data?.data?.items) return [];
    return parentCategoryQuery.data.data.items.map((item) => {
      const hasChildren =
        childCategoryQuery.data &&
        childCategoryQuery.data.length > 0 &&
        activeTab === item.id;
      return {
        label: item.name,
        key: item.id.toString(),
        children: hasChildren ? (
          <LibraryMaterialChildTab
            parentId={item.id}
            activeChildTab={activeChildTab}
            setActiveChildTab={setActiveChildTab}
            childCategories={childCategoryQuery.data || []}
          />
        ) : null,
      };
    });
  }, [
    parentCategoryQuery.data?.data?.items,
    childCategoryQuery.data,
    activeTab,
    activeChildTab,
  ]);

  return (
    <div>
      <div className="screen-header">
        <div className="screen-header-content">
          <button
            className="back-button"
            onClick={() => navigate({ to: '/m/library' })}
          >
            <IoArrowBack />
          </button>
          <Title level={4} className="screen-title">
            {t('Khai Thị')}
          </Title>
        </div>
      </div>
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
              setActiveChildTab(undefined);
              setSelectedItem(null);
            }}
            items={parentTabs}
            tabBarGutter={24}
            size="large"
            className="category-tabs"
          />
        )}
        <div style={{ marginTop: 16, padding: '0 12px' }}>
          {isMaterialsLoading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <List
              grid={{ gutter: 24, column: 1 }}
              dataSource={libraryMaterials?.data?.items || []}
              renderItem={(item) => {
                const file = item.files?.[0];
                return (
                  <List.Item
                    onClick={() => setSelectedItem(item)}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      cursor: 'pointer',
                      marginBottom: 24,
                    }}
                  >
                    <PlayCircleOutlined
                      style={{
                        fontSize: 40,
                        color: '#a15318',
                        marginRight: 16,
                      }}
                    />
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
                    </div>
                  </List.Item>
                );
              }}
            />
          )}
        </div>
        <Modal
          open={!!selectedItem}
          onCancel={() => setSelectedItem(null)}
          footer={null}
          centered
          styles={{ body: { padding: 0 } }}
          width="100vw"
          style={{ top: 0, maxWidth: 480 }}
          closeIcon={
            <button
              style={{
                background: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                position: 'absolute',
                top: 0,
                right: 0,
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
              <div style={{ padding: 16 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  {isVideo(selectedItem.files?.[0]) ? (
                    <video
                      src={selectedItem.files?.[0]?.storagePath}
                      controls
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        background: '#000',
                      }}
                      poster={selectedItem.thumbnailUrl}
                    />
                  ) : (
                    <audio
                      src={selectedItem.files?.[0]?.storagePath}
                      controls
                      style={{ width: '100%' }}
                    />
                  )}
                </div>
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
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  {selectedItem.title}
                </div>
                <Paragraph
                  style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}
                >
                  {selectedItem.description}
                </Paragraph>
                {selectedItem.files?.[0] && (
                  <div style={{ marginTop: 12 }}>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={() =>
                        downloadMutation.mutate({
                          materialId: selectedItem.id,
                          fileId: selectedItem.files[0].id,
                        })
                      }
                    >
                      {t('Download')}
                    </Button>
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
