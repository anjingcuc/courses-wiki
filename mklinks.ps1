Get-ChildItem -Path .\docs\*\* -Recurse -Directory -Force -ErrorAction SilentlyContinue |
    ForEach-Object {
        $link = Join-Path -Path $_.FullName -ChildPath "slideshow.html"
        $target = Resolve-Path -Path ".\material\slideshow.html" -Relative

        New-Item -Path $link -Force -ItemType SymbolicLink -Value $target
    }