import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage 컴포넌트', () => {
  it('에러 메시지가 렌더링됨', () => {
    render(<ErrorMessage>에러가 발생했습니다</ErrorMessage>);
    expect(screen.getByText('에러가 발생했습니다')).toBeInTheDocument();
  });

  it('children이 없으면 렌더링되지 않음', () => {
    const { container } = render(<ErrorMessage>{null}</ErrorMessage>);
    expect(container.firstChild).toBeNull();
  });

  it('빈 문자열이면 렌더링되지 않음', () => {
    const { container } = render(<ErrorMessage>{''}</ErrorMessage>);
    expect(container.firstChild).toBeNull();
  });

  it('alert role이 적용됨', () => {
    render(<ErrorMessage>에러</ErrorMessage>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('에러 아이콘이 표시됨', () => {
    const { container } = render(<ErrorMessage>에러</ErrorMessage>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-red-600');
  });

  it('에러 스타일이 적용됨', () => {
    render(<ErrorMessage>에러</ErrorMessage>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50', 'border-red-200');
  });

  it('커스텀 className이 적용됨', () => {
    render(<ErrorMessage className="custom-error">에러</ErrorMessage>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-error');
  });

  it('복잡한 children도 렌더링됨', () => {
    render(
      <ErrorMessage>
        <div>
          <strong>오류:</strong> 네트워크 연결 실패
        </div>
      </ErrorMessage>
    );
    expect(screen.getByText('오류:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('네트워크 연결 실패', { exact: false })).toBeInTheDocument();
  });

  it('텍스트 색상이 빨강임', () => {
    const { container } = render(<ErrorMessage>에러</ErrorMessage>);
    const textDiv = container.querySelector('.text-red-800');
    expect(textDiv).toBeInTheDocument();
  });
});
