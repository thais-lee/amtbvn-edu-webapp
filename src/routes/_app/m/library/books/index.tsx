import {
  CloseOutlined,
  DownloadOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ConfigProvider,
  Divider,
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

export const Route = createFileRoute('/_app/m/library/books/')({
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

function formatFileSize(size: number) {
  if (!size) return '';
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  if (size < 1024 * 1024 * 1024) return (size / 1024 / 1024).toFixed(1) + ' MB';
  return (size / 1024 / 1024 / 1024).toFixed(1) + ' GB';
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

  const parentCategoryQuery = useQuery({
    queryKey: ['categories-books'],
    queryFn: () =>
      categoryService.getAllCategories({
        parentId: 19, // Use a different parentId for books if needed
      }),
  });

  const { data: libraryMaterials, isLoading: isMaterialsLoading } = useQuery({
    queryKey: ['library-materials-books', activeChildTab],
    queryFn: () =>
      libraryMaterialService.getAllLibraryMaterials({
        categoryId: activeChildTab,
        take: 10,
        skip: 0,
      }),
    enabled: !!activeChildTab,
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

  const childCategoryQuery = useQuery({
    queryKey: ['categories-books', activeTab],
    enabled: !!activeTab,
    queryFn: () =>
      categoryService.getAllCategories({
        parentId: activeTab!,
      }),
    select(data) {
      return data.data.items;
    },
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
            {t('Kinh Sách')}
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
        <div style={{ marginTop: 16 }}>
          {isMaterialsLoading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <List
              dataSource={libraryMaterials?.data?.items || []}
              renderItem={(item) => (
                <List.Item
                  onClick={() => setSelectedItem(item)}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    marginBottom: 12,
                    background: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ marginRight: 12 }}>
                    <span role="img" aria-label="document">
                      <FileOutlined
                        style={{ fontSize: 40, color: '#a15318' }}
                      />
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}
                    >
                      {item.title}
                    </div>
                    <Paragraph
                      style={{ margin: 0, color: '#888' }}
                      ellipsis={{ rows: 2 }}
                    >
                      {item.description}
                    </Paragraph>
                    <Space>
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
                    <div style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>
                      {item.createdAt
                        ? dayjs(item.createdAt).format('DD/MM/YYYY')
                        : ''}
                    </div>
                  </div>
                  <FileOutlined
                    style={{ fontSize: 28, color: '#a15318', marginLeft: 8 }}
                  />
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
          width="100vw"
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
              <div style={{ padding: 16 }}>
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
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                      {selectedItem.files[0].fileName}
                    </div>
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
                      {selectedItem.files[0].size
                        ? `(${formatFileSize(selectedItem.files[0].size)})`
                        : ''}
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
