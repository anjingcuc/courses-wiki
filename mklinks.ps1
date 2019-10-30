Get-ChildItem -Path .\docs\*\* -Recurse -Directory -Force -ErrorAction SilentlyContinue |
    ForEach-Object {
        $link = Join-Path -Path $_.FullName -ChildPath "slideshow.html"
        $target = "..\..\..\material\slideshow.html"

        New-Item -Path $link -Force -ItemType SymbolicLink -Value $target
    }