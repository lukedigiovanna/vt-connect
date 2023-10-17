export const debounce = <F extends (...args: any[]) => any>(
    func: F,
    waitFor: number,
  ) => {
    let timeout: NodeJS.Timeout | null = null;
  
    const debounced = (...args: any[]) => {
      if (timeout)
        clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), waitFor)
    }
  
    return debounced as unknown as (...args: Parameters<F>) => ReturnType<F>
  }