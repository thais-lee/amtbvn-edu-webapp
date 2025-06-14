import {
  Outlet,
  createRootRouteWithContext,
  useNavigate,
  useRouterState, // Hoặc useLocation tùy phiên bản TanStack Router
} from '@tanstack/react-router';
import { Grid, Spin } from 'antd';
import { Suspense, useEffect, useState } from 'react';

// Import Grid và Spin

const { useBreakpoint } = Grid;

// Define context if needed
type MyRouterContext = object;

function RootComponent() {
  const navigate = useNavigate();
  // Sử dụng useRouterState để lấy location một cách an toàn hơn trong context của router
  const location = useRouterState({ select: (s) => s.location });
  const screens = useBreakpoint();
  // State để đảm bảo chỉ kiểm tra và điều hướng một lần khi tải trang
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  // State để chờ `screens` có giá trị lần đầu
  const [isScreensReady, setIsScreensReady] = useState(false);

  useEffect(() => {
    // Đánh dấu là screens đã sẵn sàng khi nó không còn là undefined
    if (screens !== undefined) {
      setIsScreensReady(true);
    }
  }, [screens]);

  useEffect(() => {
    // Chỉ chạy khi screens đã sẵn sàng và chưa kiểm tra lần đầu
    if (!isScreensReady || initialCheckDone) {
      return;
    }

    const isMobile = screens.xs || !screens.md; // Mobile = xs, sm. Desktop = md+
    const currentPath = location.pathname;
    const currentSearch = location.searchStr; // Lấy search params
    const currentHash = location.hash;

    console.log(
      `Root Check: Path=${currentPath}, Mobile=${isMobile}, Screens Ready=${isScreensReady}`,
    );

    let targetPath: string | null = null;
    const defaultMobileRoute = '/m/home'; // Route mặc định cho mobile
    const defaultDesktopRoute = '/d/home'; // Route mặc định cho desktop

    if (isMobile) {
      // Nếu đang ở mobile nhưng đường dẫn không bắt đầu bằng /m/
      if (!currentPath.startsWith('/m/')) {
        if (currentPath.startsWith('/d/')) {
          // Cố gắng chuyển từ /d/ sang /m/
          targetPath = '/m' + currentPath.substring(2);
        } else if (currentPath !== '/') {
          // Nếu là trang gốc hoặc trang không xác định, chuyển về mặc định
          targetPath = defaultMobileRoute;
        } else if (currentPath === '/') {
          // Nếu là trang gốc, chuyển về mặc định mobile
          targetPath = defaultMobileRoute;
        }
        console.log(`Redirecting to mobile path: ${targetPath}`);
      }
    } else {
      // Is Desktop
      // Nếu đang ở desktop nhưng đường dẫn không bắt đầu bằng /d/
      if (!currentPath.startsWith('/d/')) {
        if (currentPath.startsWith('/m/')) {
          // Cố gắng chuyển từ /m/ sang /d/
          targetPath = '/d' + currentPath.substring(2);
        } else if (currentPath !== '/') {
          targetPath = defaultDesktopRoute;
        } else if (currentPath === '/') {
          targetPath = defaultDesktopRoute;
        }
        console.log(`Redirecting to desktop path: ${targetPath}`);
      }
    }

    // Đánh dấu đã kiểm tra xong
    setInitialCheckDone(true);

    // Chỉ điều hướng nếu targetPath hợp lệ và khác path hiện tại
    if (targetPath && targetPath !== currentPath) {
      navigate({
        to: targetPath,
        // search: currentSearch, // Giữ lại query params
        hash: currentHash, // Giữ lại hash
        replace: true, // Thay thế lịch sử trình duyệt, không tạo back về trang gốc
      });
    }
  }, [isScreensReady, screens, initialCheckDone, navigate, location]);

  // Hiển thị loading trong khi chờ xác định màn hình và điều hướng ban đầu
  if (!initialCheckDone && isScreensReady) {
    return <Spin fullscreen tip="Đang tải giao diện..." />;
  }

  return (
    // Suspense bao ngoài Outlet để hỗ trợ lazy loading routes
    <Suspense fallback={<Spin fullscreen />}>
      <Outlet />
    </Suspense>
    // Optional DevTools
    // <TanStackRouterDevtools position="bottom-right" />
  );
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

// Export để các route con tham chiếu
export const rootRoute = Route;
