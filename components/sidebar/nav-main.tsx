import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';


export function NavMain({ navMain }) {
  const pathname = usePathname();

  if (!Array.isArray(navMain)) {
    return null;
  }

  return (
    <nav>
      <ul>
        {navMain.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <div
                className={cn(
                  'flex items-center p-2 rounded-md',
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : ' hover:bg-gray-500'
                )}
              >
                <item.icon className="mr-2" />
                <div className="grid flex-1 text-left text-sm ">
                  <span className="truncate text-sm font-medium">{item.title}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
